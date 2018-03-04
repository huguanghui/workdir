TARGET = hgh_nopoll_server
INCLUDE = -I. -I./include -I/usr/local/include/nopoll
LDFLAGS = -pthread 
FLAGS_OPTS = -Wstack-protector -g -O2 $(INCLUDE)
C_COMPILE = cc
C_FLAGS = $(FLAGS_OPTS)
CPP_COMPILE = c++
CPP_FLAGS = $(FLAGS_OPTS)
LINK = cc -o
LINK_OPTS = -L. -Llib $(LDFLAGS) -L/usr/local/lib
CONSOLE_LINK_OPTS = $(LINK_OPTS)
ORG_DIR = ./lib
ORG_LIB = -lnopoll -lssl -lcrypto -lpthread
LOCAL_LIBS = $(ORG_LIB)
LIBS = $(LOCAL_LIBS)
AR = ar cr
RM = rm -rf
OBJS = src/hgh_nopoll_main.o src/hgh_nopoll_common.o

$(TARGET) : $(OBJS)
	$(LINK) $(TARGET) $(OBJS) $(CONSOLE_LINK_OPTS) $(LIBS)

$(OBJS) : %.o : %.c
	$(C_COMPILE) -c $(C_FLAGS) $< -o $@

clean :
	-$(RM) $(TARGET) $(OBJS)
